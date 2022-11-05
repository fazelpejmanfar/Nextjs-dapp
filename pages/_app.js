import '../styles/globals.css'
import Wrapper from '../context/Connector'
import { Toaster } from 'react-hot-toast'

function MyApp({ Component, pageProps }) {
  return (
    <Wrapper>
    <Toaster/>
  <Component {...pageProps} />
  </Wrapper>
)}

export default MyApp
