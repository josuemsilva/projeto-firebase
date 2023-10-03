import { useState, useEffect } from "react";
import { db, auth } from "./firebase_Connection";
import {
  doc,
  getDocs,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./app.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    async function loadPosts() {
      // eslint-disable-next-line
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            title: doc.data().titulo,
            author: doc.data().autor,
          });
        });
        setPosts(listaPost);
      });
    }
    loadPosts();
  }, []);

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log(user);
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email,
          });
        } else {
          setUser(false);
          setUserDetail({});
        }
      });
    }
    checkLogin();
  }, []);

  async function searchPost() {
    // const postRef = doc(db, "posts", "iuGahr1prR6g6zMzFp81");
    // await getDoc(postRef)
    //   .then((snapshot) => {
    //     setAutor(snapshot.data().autor);
    //     setTitulo(snapshot.data().titulo);
    //   })
    //   .catch((error) => {
    //     alert("Erro ao buscar");
    //     console.log(error);
    //   });

    const postsRef = collection(db, "posts");
    await getDocs(postsRef)
      .then((snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            title: doc.data().titulo,
            author: doc.data().autor,
          });
        });
        setPosts(lista);
      })
      .catch((error) => {
        alert("Houve algum erro!");
        console.log(error);
      });
  }

  async function handleAdd() {
    // await setDoc(doc(db, "posts", "12345"), {
    //   titulo: titulo,
    //   autor: autor,
    // })
    //   .then(() => {
    //     console.log("dados registrados no banco!");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        console.log("Cadastrado com sucesso!");
        setAutor("");
        setTitulo("");
      })
      .catch((error) => console.log(error));
  }

  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        alert("Post deletado com sucesso!");
      })
      .catch(() => {
        alert("Houve um erro na exclusão!");
      });
  }
  async function editarPost() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        alert("POST ATUALIZADO");
        setIdPost("");
        setAutor("");
        setTitulo("");
      })
      .catch(() => {
        alert("Erro ao atualizar o post!");
      });
  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        alert("Cadastro com sucesso!");
        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        if (error.code === "auth/weak") {
          alert("Senha muito fraca!");
        } else if (error.code === "auth/email-already-in-use") {
          alert("Email já existe!");
        }
      });
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log(value);
        setUserDetail({
          uid: value.user.uid,
          email: value.user.email,
        });
        setUser(true);
        setEmail("");
        setSenha("");
      })
      .catch(() => {
        alert("Erro ao fazer login!");
      });
  }

  async function fazerLogout() {
    await signOut(auth);
    setUser(false);
    setUserDetail({});
  }
  return (
    <div className="App">
      <h1>ReactJS & Firebase</h1>
      {user && (
        <div>
          <strong>Seja bem vindo(a)! Você está logado!</strong> <br />
          <span>
            ID: {userDetail.uid} - Email: {userDetail.email}
          </span>
          <br />
          <button onClick={fazerLogout}>Sair da conta</button>
          <br /> <br />
        </div>
      )}
      <div className="container">
        <h2>USUÁRIOS</h2>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite um email"
        />
        <br />

        <label>Senha</label>
        <input
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Informe sua senha"
        />
        <br />
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer Login</button>
      </div>
      <br /> <br />
      <hr />
      <div className="container">
        <h2>POSTS</h2>
        <label>ID do Post:</label>
        <input
          placeholder="Digite o ID do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
        <label>Título:</label>
        <textarea
          type="text"
          placeholder="digite o título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <label>Autor:</label>
        <input
          type="text"
          placeholder="autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={searchPost}>Buscar Posts</button> <br />
        <button onClick={editarPost}>Atualizar post</button>
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>ID: {post.id}</strong> <br />
                <span>Título: {post.title}</span> <br />
                <span>Autor: {post.author}</span> <br /> <br />
                <button onClick={() => excluirPost(post.id)}>Excluir</button>
                <br /> <br />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;
