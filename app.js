const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/projeto_knights', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});


const knightSchema = new mongoose.Schema({
    name: String,
    nickname: String,
    birthday: Date,
    weapons: [{
        name: String,
        mod: Number,
        attr: String,
        equipped: Boolean
    }],
    attributes: {
        strength: Number,
        dexterity: Number,
        constitution: Number,
        intelligence: Number,
        wisdom: Number,
        charisma: Number
    },
    keyAttribute: String,
    attack: Number,
    exp: Number
});

const Knight = mongoose.model('Knight', knightSchema);

app.use(express.urlencoded({ extended: true }));

// app.set('views', path.join(__dirname, 'src/views'));
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));




// FRONT BEGIN

// TABELA lista
app.get('/', async (req, res) => {
    
   res.render('lista') ;
    // res.sendFile(path.join(__dirname, 'public', 'lista.html'));

    try {
        const knightsList = await Knight.find();
        // res.json(knights);
        res.render('lista', {knights: knightsList});
        // res.json(knights);
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// FORM Cadastro
app.get('/cadastro', (req, res) => {
    // res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
    res.render('cadastro');

});




// FRONT END

// LISTA DE knights
app.get('/knights', async (req, res) => {
    try {
        const knights = await Knight.find();
        res.json(knights);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//  CADASTRO DE knight
app.post('/knights', async (req, res) => {
    const knight = new Knight(req.body);
    try {

// ATRIBUIR FUNÇÕES PARA REGRAS DE CÁLCULO PARA "Ataque" e "Experiência"

        const newKnight = await knight.save();
        res.status(201).json(newKnight);

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ATUALIZA knight
app.put('/knights/:id', async (req, res) => {
    try {
        const knight = await Knight.findById(req.params.id);
        if (knight == null) {
            return res.status(404).json({ message: 'Knight not found' });
        }
        if (req.body.name != null) {
            knight.name = req.body.name;
        }
        if (req.body.nickname != null) {
            knight.nickname = req.body.nickname;
        }
        if (req.body.birthday != null) {
            knight.birthday = req.body.birthday;
        }
        if (req.body.weapons != null) {
            knight.weapons = req.body.weapons;
        }
        if (req.body.attributes != null) {
            knight.attributes = req.body.attributes;
        }
        if (req.body.keyAttribute != null) {
            knight.keyAttribute = req.body.keyAttribute;
        }
        if (req.body.attack != null) {
            knight.attack = req.body.attack;
        }
        if (req.body.exp != null) {
            knight.exp = req.body.exp;
        }
        const updatedKnight = await knight.save();
        res.json(updatedKnight);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/knights/:id', async (req, res) => {
    try {
        const knight = await Knight.findByIdAndDelete(req.params.id);
        if (knight) {
            res.json({ message: `Knight ID=${ req.params.id } excluído com sucesso` });
        } else {
            res.status(404).json({ message: `Knight ID=${ req.params.id } não encontrada` });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




 /* Routes -  END */

 /* FUNCTIONS */

 function atackCalc() {

    return '';
}

function expCalc() {

    return 0;
}

 /* FUNCTIONS */



/*
// Rota para criar uma nova pessoa
app.post('/pessoas', async (req, res) => {
    try {
        const { nome, idade, email } = req.body;
        const pessoa = new Pessoa({ nome, idade, email });
        await pessoa.save();
        res.status(201).json(pessoa);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rota para obter todas as pessoas
app.get('/pessoas', async (req, res) => {
    try {
        const pessoas = await Pessoa.find();
        res.json(pessoas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para obter os detalhes de uma pessoa específica
app.get('/pessoas/:id', async (req, res) => {
    try {
        const pessoa = await Pessoa.findById(req.params.id);
        if (pessoa) {
            res.json(pessoa);
        } else {
            res.status(404).json({ message: 'Pessoa não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para atualizar os dados de uma pessoa
app.put('/pessoas/:id', async (req, res) => {
    try {
        const pessoa = await Pessoa.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (pessoa) {
            res.json(pessoa);
        } else {
            res.status(404).json({ message: 'Pessoa não encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rota para excluir uma pessoa
app.delete('/pessoas/:id', async (req, res) => {
    try {
        const pessoa = await Pessoa.findByIdAndDelete(req.params.id);
        if (pessoa) {
            res.json({ message: 'Pessoa excluída com sucesso' });
        } else {
            res.status(404).json({ message: 'Pessoa não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
*/

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
