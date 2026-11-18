import { Routes, Route, Navigate } from 'react-router-dom'
import RotaPrivada from './components/RotaPrivada.jsx'
import Login from './paginas/Login.jsx'
import Feed from './paginas/Feed.jsx'
import Perfil from './paginas/Perfil.jsx'
import Configuracoes from './paginas/Configuracoes.jsx'

// O "mapa" do site: cada endereço (path) mostra uma página diferente
function App() {
  return (
// ... o resto dos imports e o começo do App continuam iguais
<Routes>
    <Route path="/login" element={<Login />} />

    {/* Tudo o que está dentro da RotaPrivada só abre para quem fez login */}
     <Route element={<RotaPrivada />}/>
        <Route path="/" element={<Feed />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="/configuracoes" element={<Configuracoes />} />

        <Route path="*" element={<Navigate to="/" />} />
</Routes>


)
}
export default App;