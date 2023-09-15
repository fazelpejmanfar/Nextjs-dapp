import { HeaderItems } from "../lib/constants";
function Footer() {

    return (
        <footer className="w-full absolute bottom-0 text-black">
      <div className="flex justify-end items-center gap-5 p-5">
        {HeaderItems.map((item, id) => {
          return (
            <a
              key={id}
              className="social"
              href={item.target}
              target={"_blank"}
              rel="noreferrer"
            >
              {item.img}
            </a>
          );
        })}
      </div>
        </footer>
    );
}

export default Footer;