import HeroSection from "./_component/HeroSection";
import PopularBrands from "./_component/PopularBrands";
import BrowseByCategory from "./_component/BrowseByCategory";
import FeaturedVehicles from "./_component/FeaturedVehicles";
import CustomerReviews from "./_component/CustomerReviews";
import CTASection from "./_component/CTASection";
import Footer from "./_component/Footer";
import { handleGetPublicBrands } from "@/lib/actions/public/brand-action";
import { handleGetPublicCategories } from "@/lib/actions/public/category-action";
import { handleGetPublicVehicles } from "@/lib/actions/public/vehicle-action";
import { handleGetFeaturedReviews } from "@/lib/actions/public/review-action";
import WallEChatWidget from "./_component/WallEChatWidget";

export default async function HomePage() {
  // fetch all data in parallel for better performance
 const [brandsResult, categoriesResult, vehiclesResult, reviewsResult] = await Promise.all([
  handleGetPublicBrands(),
  handleGetPublicCategories(),
  handleGetPublicVehicles(),
  handleGetFeaturedReviews(3),
  ]);

  return (
    <div>
      {/* hero section with search */}
      <HeroSection 
      categories={categoriesResult.success ? categoriesResult.data : []}
      totalVehicles={vehiclesResult.success ? vehiclesResult.data.length : 0}
       />

      {/* popular brands from api */}
      <PopularBrands brands={brandsResult.success ? brandsResult.data : []} />

      {/* browse by category */}
      <BrowseByCategory categories={categoriesResult.success ? categoriesResult.data : []} />

      {/* featured vehicles from api */}
      <FeaturedVehicles vehicles={vehiclesResult.success ? vehiclesResult.data : []} />

      {/* customer reviews*/}
      <CustomerReviews reviews={reviewsResult.success ? reviewsResult.data : []} />

      {/* cta section */}
      <CTASection />

      {/* footer */}
      <Footer />
      {/* Wall-E AI assistant */}
      <WallEChatWidget />
    </div>
  );
}