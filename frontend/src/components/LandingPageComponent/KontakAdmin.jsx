import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneAlt } from "@fortawesome/free-solid-svg-icons";

const KontakAdmin = () => {
  const whatsappNumber = "6285156142271";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="kontak-admin">
      <h2 className="kontak-admin-title">Kontak Admin</h2>
      <p className="kontak-admin-text">
        Jika Anda adalah pemilik kost dan ingin menitipkan kamar Anda, silakan
        hubungi kami di:
      </p>
      <div className="kontak-admin-info">
        <FontAwesomeIcon icon={faPhoneAlt} className="kontak-admin-icon" />
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="kontak-admin-link"
        >
          <span className="kontak-admin-number">{whatsappNumber}</span>
        </a>
      </div>
    </div>
  );
};

export default KontakAdmin;
