import "../styles/globals.css";
import Web3Providers from "../providers/Connector";
import { Toaster } from "react-hot-toast";
import { ToastOptions } from "../lib/toastOptions";
function MyApp({ Component, pageProps }) {
  return (
    <Web3Providers>
      <Toaster toastOptions={ToastOptions} />
      <Component {...pageProps} />
    </Web3Providers>
  );
}

export default MyApp;
