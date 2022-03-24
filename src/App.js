import { useState, useEffect } from "react";
import firebase from "./firebaseConnection";
import './styles.css';

function App() {
  const [idPost, setIdPost] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState([]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({});

  useEffect(() => {
    async function loadPosts() {
      await firebase.firestore().collection('posts')
        .onSnapshot((doc) => {
          let meusPosts = [];

          doc.forEach((item) => {
            meusPosts.push({
              id: item.id,
              titulo: item.data().titulo,
              autor: item.data().autor,
            })
          });

          setPosts(meusPosts);

        })
    }

    loadPosts();
  }, [])


  useEffect(()=>{

    async function checkLogin(){
      await firebase.auth().onAuthStateChanged((user)=>{
        if(user){ //se tem usuário logado, entrar nessa condição...
          setUser(true);
          setUserLogged({
            uid: user.uid,
            email: user.email
          })
        }else{ //não possui nenhum user logado...
          setUser(false);
          setUserLogged({});
        }
      })
    }


  }, []);

  async function handleAdd() {

    await firebase.firestore().collection('posts')
      .add({                                                          //gerar id aleatório. para não gerar conflitos.
        titulo: titulo,
        autor: autor,
      })
      .then(() => {
        console.log('dados cadastrados com sucesso');
        setTitulo('');
        setAutor('');
      })
      // .doc('12345')                        // eu crio automatico aqui.
      // .set({
      //   titulo: titulo,
      //   autor: autor,
      // })
      .catch((error) => {
        console.log('gerou algum error: ' + error)
      })
  }



  async function buscaPost() {
    // await firebase.firestore().collection('posts')
    // .doc('12345')
    // .get()
    // .then((snapshot)=>{

    //   setTitulo(snapshot.data().titulo);
    //   setAutor(snapshot.data().autor);
    // })
    // .catch(()=>{
    //   console.log('something is wrong')
    // })

    await firebase.firestore().collection('posts')
      .get()
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })

        setPosts(lista);

      })
      .catch(() => {
        console.log('deu algum erro.')
      })
  }

  async function editarPost() {
    await firebase.firestore().collection('posts')
      .doc(idPost)
      .update({
        titulo: titulo,
        autor: autor
      })
      .then(() => {
        alert('dados atualizados com sucesso.')
        setIdPost('');
        setTitulo('');
        setAutor('');
      })
      .catch(() => {
        console.log('erro ao atualizar');
      })
  }

 async function excluirPost(id){
    await firebase.firestore().collection('posts').doc(id)
    .delete()
    .then(()=>{
      alert('esse post foi excluido')
    })
    .catch(()=>{
      alert('não foi possivel excluir')
    })
  }


   async function novoUsuario(){
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then((value)=>{
      console.log(value);
    })
    .catch((error)=>{
      if(error.code === 'auth/weak-password'){
        alert('Senha muito fraca...')
      }else if(error.code === 'auth/email-already-in-use'){
        alert('Email já existente.')
      }
    })
  }

  async function logOut(){
    await firebase.auth().signOut();  
  }

  return (

    <div>
      <h1>react.js + firebase</h1> <br />

      {user && ( //&& condicional. quando tiver true, executa isso.
        <div>
          <strong>Seja bem vindo(a)! Você está logado.</strong> <br />
          <span>{userLogged.uid} - {userLogged.email}</span>
          <br/> <br/>
        </div>
      )}

      <div className="container">
        <label>Email</label>
        <input type="text" value={email} onChange={ (e) => setEmail(e.target.value) } /> <br/>

        <label>Senha</label>
        <input type="password" value={senha} onChange={ (e) => setSenha(e.target.value) } /> <br/>

        <button onClick={ novoUsuario }>Cadastrar</button>
        <button onClick={ logOut }>Sair da conta</button>
      </div>

      <hr/> <br/>

      <div className="container">
        <h2>Banco de dados:</h2>
        <label>ID: </label>
        <input type="text" value={idPost} onChange={(e) => setIdPost(e.target.value)} /> <br />

        <label>Titulo: </label> <br />
        <textarea type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} /> <br />

        <label>Autor: </label> <br />
        <input type="text" value={autor} onChange={(e) => setAutor(e.target.value)} /> <br />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscaPost}>Buscar post</button>
        <button onClick={editarPost}>Editar</button> <br />

      </div>
      <ul>
        {posts.map((post) => {
          return (
            <li key={post.id}>
              <span>ID - {post.id} </span> <br />
              <span>Titulo: {post.titulo} </span> <br />
              <span>Autor: {post.autor}</span> <br />
              <button onClick={ () => excluirPost(post.id)}>Excluir post</button>
            </li>
          )
        })}
      </ul>


    </div>
  );
}

export default App;
