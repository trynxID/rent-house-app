import NavbarGeneral from "../components/LandingPageComponent/NavbarGeneral";
import Banner from "../components/LandingPageComponent/Banner";
import Recommendation from "../components/LandingPageComponent/Recommendation";
import Coverage from "../components/LandingPageComponent/Coverage";
import "../dist/landingpage.css";
const LandingPage = () => {
  return (
    <>
      <NavbarGeneral />
      <Banner />
      <Recommendation />
      <Coverage />
    </>
  );
};

export default LandingPage;
