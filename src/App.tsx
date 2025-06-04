import { Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import UploadPage from "./components/UploadPage"
import Customize from "./components/Customize"

function App() {

  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/upload' element={<UploadPage />}></Route>
      <Route path='/customize' element={<Customize />}></Route>
    </Routes>
  )
}

export default App
