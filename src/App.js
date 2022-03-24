import { useState, useEffect } from "react";
import firebase from "./firebaseConnection";

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    async function loadPosts(){
        await firebase.firestore().collection('posts')
      .onSnapshot((doc)=>{
        let meusPosts = [];

        doc.forEach((item)=>{
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

  const title = "react.js + firebase. it's working out. "

  return (

    <div className="App">
      <h1>{title}</h1> <br />

      <label>Titulo: </label> <br />
      <textarea type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} /> <br />

      <label>Autor: </label> <br />
      <input type="text" value={autor} onChange={(e) => setAutor(e.target.value)} /> <br />

      <button onClick={handleAdd}>Cadastrar</button>
      <button onClick={buscaPost}>Buscar post</button> <br />

      <ul>
        {posts.map((post) => {
          return (
            <li key={post.id}>
              <span>Titulo: {post.titulo} </span> <br />
              <span>Autor: {post.autor}</span> <br />
            </li>
          )
        })}
      </ul>


    </div>
  );
}

export default App;
