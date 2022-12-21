import '../styles/globals.css'
import Wrapper from '../context/Connector'
import { Toaster } from 'react-hot-toast'
import MusicPlayer from '../components/MusicPlayer'

function MyApp({ Component, pageProps }) {
  return (
    <Wrapper>
    <Toaster/>
  <Component {...pageProps} />
  <MusicPlayer/>
  </Wrapper>
)}

export default MyApp
