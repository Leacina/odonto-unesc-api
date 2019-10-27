const fs = require('fs');

module.exports = app => {
    const index = (req, res) => {

    }

    const show = (req, res) => {
        const { videoName } = req.params;
        const movieFile = `./upload/video/${videoName}`;

        fs.stat(movieFile, (err, stats) => {
        if (err) {
        console.log(err);
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
        try {
    
            //Valida as regras de negocio e retorna o objeto caso esteja correto
            const video = await app.src.services.VideoService.store(req);

            const {url} = req.headers

            //Upload por stream
            req.pipe(fs.createWriteStream('upload/video/' + url))
                .on('finish', function(){
                return res.status(201).send(video);
            });

        } catch(err) {
            //Se houver algum erro, retorna o objeto com a mensagem de erro
            return res.status(400).send({
                status: 400,
                url: req.body.url,
                is_active: req.body.is_active,
                erro: err 
            });
        }
    }
    
    const update = (req, res) => {}
    
    const destroy = (req, res) => {}

    return {index, show, store, update, destroy}
}