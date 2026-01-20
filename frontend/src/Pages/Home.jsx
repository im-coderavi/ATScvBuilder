import Navbar from '../Components/Shared/Navbar';
import Footer from '../Components/Shared/Footer';
import SoftBackdrop from '../Components/UI/SoftBackdrop';
import LenisScroll from '../Components/UI/LenisScroll';
import HeroSection from '../Components/Home/HeroSection';
import FeaturesSection from '../Components/Home/FeaturesSection';
import PricingSection from '../Components/Home/PricingSection';
import FAQSection from '../Components/Home/FAQSection';
import CTASection from '../Components/Home/CTASection';

const Home = () => {
    return (
        <div className="min-h-screen text-white selection:bg-indigo-500/30 overflow-x-hidden">
            <SoftBackdrop />
            <LenisScroll />
            <Navbar />

            <main>
                <HeroSection />
                <FeaturesSection />
                <PricingSection />
                <FAQSection />
                <CTASection />
            </main>

            <Footer />
        </div>
    );
};

export default Home;
