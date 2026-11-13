import { Routes, Route, Navigate } from'react-router-dom'
import Login from'./paginas/Login.jsx'
import Feed from'./paginas/Feed.jsx'
import Perfil from'./paginas/Perfil.jsx'
import Configuracoes from'./paginas/Configuracoes.jsx'

function App() {
    return (
       <Route>
          <Route path='/login'element={<Login />}/>
          <Route path='/'element={<Feed />}/>
          <Route path='/perfil'element={<Perfil />}/>
          <Route path='/Configuracoes'element={<Configuracoes />}/>

           <Route path="*" element={<Navigate to="/" />} />
       </Route>
    )
}
export default App