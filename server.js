const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do bodyParser para analisar corpos de solicitação HTML
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Usa a variável de ambiente para o usuário de e-mail
    pass: process.env.EMAIL_PASS, // Usa a variável de ambiente para a senha de e-mail
  },
});

// Rota para a raiz
app.get('/', (req, res) => {
  res.send('Bem-vindo ao servidor de e-mail.');
});

// Rota para enviar e-mail
app.post('/send-email', (req, res) => {
  const { nome, email, telefone, assunto, mensagem } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, // Usa a variável de ambiente para o remetente de e-mail
    to: 'destinatario@gmail.com', // Endereço de e-mail do destinatário
    subject: assunto,
    text: `Nome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\n\nMensagem: ${mensagem}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Erro ao enviar o e-mail');
    } else {
      console.log('E-mail enviado: ' + info.response);
      res.status(200).send('E-mail enviado com sucesso');
    }
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
