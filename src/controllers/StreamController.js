const fs = require('fs');

module.exports = app => {
    const index = (req, res) => {

    }

    const show = (req, res) => {
        const { videoName } = req.params;
        const movieFile = `./upload/video/${videoName}`;

        fs.stat(movieFile, (err, stats) => {
            if (err) {
                return res.status(404).end('Vídeo não encontrado');
            }

            // Variáveis necessárias para montar o chunk header corretamente
            const { range } = req.headers;
            const { size } = stats;
            const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
            const end = size - 1;
            const chunkSize = (end - start) + 1;
        
            // Definindo headers de chunk
            res.set({
                'Content-Range': `bytes ${start}-${end}/${size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4'
            });
        
            // É importante usar status 206 - Partial Content para o streaming funcionar
            res.status(206)
        
            // Utilizando ReadStream do Node.js
            // Ele vai ler um arquivo e enviá-lo em partes via stream.pipe()
            const stream = fs.createReadStream(movieFile, { start, end });
            stream.on('open', () => stream.pipe(res));
            stream.on('error', (streamErr) => res.end(streamErr));
        });
    }
    
    const store = async (req, res) => {
        const files = req.files;
        res.send({ message: files.file.path.substring(11) });
    }
    
    const update = (req, res) => {}
    
    const destroy = (req, res) => {}

    return {index, show, store, update, destroy}
}