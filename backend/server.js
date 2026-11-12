import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import banco from './banco.js'

const app= express()
const PORTA = 3000
const SEGREDO='segredo-do-instaclone'



app.listen(PORTA,() =>{
    console.log("Servidor iniciado na URL:http://localhost:"+PORTA);
})
app.use(express.json())
app.use(cors())
app.use(cors()) // libera o front-end (que roda em outra porta) para conversar com a gente
app.use(express.json()) // ensina o servidor a entender dados em formato JSON
app.use('/uploads', express.static('uploads')) // deixa o navegador abrir as fotos da pasta uploads


//NOSSO PORTEIRO
function exigirLogin(req,res,next){
    const cabecalho= req.headers.authorization

    if(!cabecalho) {
        res.status(401).json({
            erro:'Faça longin para continuar.'
        })
    }

    const token = cabecalho.split(' ')[1]

    try {
         const dados= jwt.verify(token, SEGREDO)
        req.usuarioId = dados.id
        next()
    } catch{
       req.status(401).json({
        erro: "Sessão invalidade. Faça login novamente"
       })
    }
    
}

// Busca os dados de uma pessoa (nunca devolve a senha!)
function buscarPessoa(id) {
return banco
.prepare('SELECT id, usuario, nome, bio, foto FROM usuarios WHERE id = ?')
.get(id)
}

// POST /login -> confere usuário e senha e devolve um token
app.post('/login', (req, res) => {
  const usuario = req.body.usuario
  const senha = req.body.senha

  if (!usuario || !senha) {
    return res.status(400).json({ erro: 'Informe o usuário e a senha.' })
  }


 const pessoa = banco
    .prepare('SELECT * FROM usuarios WHERE usuario = ?')
    .get(usuario)
 
  if (!pessoa || !bcrypt.compareSync(senha, pessoa.senha)) {
    return res.status(401).json({ erro: 'Usuário ou senha incorretos.' })
  }
  const token = jwt.sign({id: pessoa.id}, SEGREDO, {expiresIn:'7d'})

  res.json({
    token: token
  })
})

  // GET -> PERFIL
  app.get('/perfil', exigirLogin, (req, res)=>{
    const pessoa = buscarPessoa(req.usuarioId)
 
  res.json(pessoa)
})

// GET /feed -> devolve posts de todo mundo, em ordem aleatória
app.get('/feed', exigirLogin, (req, res) => {
  const posts = banco
    .prepare(
      `SELECT posts.id, posts.imagem, posts.legenda,
       usuarios.usuario AS autor, usuarios.foto AS fotoAutor
FROM posts
JOIN usuarios ON usuarios.id = posts.usuario_id
ORDER BY RANDOM()
LIMIT 6`,
    )
    .all()
 
  res.json(posts)
})
// GET /perfil -> devolve os dados de quem está logado e os posts dessa pessoa
app.get('/perfil', exigirLogin, (req, res) => {
  const pessoa = buscarPessoa(req.usuarioId)
 
  pessoa.posts = banco
    .prepare('SELECT id, imagem, legenda FROM posts WHERE usuario_id = ? ORDER BY id DESC')
    .all(req.usuarioId)
 
  res.json(pessoa)
})


