import NavbarGeneral from "../components/LandingPageComponent/NavbarGeneral";
import Banner from "../components/LandingPageComponent/Banner";
import Recommendation from "../components/LandingPageComponent/Recommendation";
import Coverage from "../components/LandingPageComponent/Coverage";
import KontakAdmin from "../components/LandingPageComponent/KontakAdmin";
import "../layouts/landingpage.css";
const LandingPage = () => {
  return (
    <>
      <NavbarGeneral />
      <Banner />
      <Recommendation />
      <Coverage />
      <KontakAdmin />
    </>
  );
};

export default LandingPage;
