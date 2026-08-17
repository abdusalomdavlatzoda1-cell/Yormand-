import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Services from "./pages/public/Services";
import ServiceDetails from "./pages/public/ServiceDetails";
import Doctors from "./pages/public/Doctors";
import DoctorDetails from "./pages/public/DoctorDetails";
import Gallery from "./pages/public/Gallery";
import BeforeAfter from "./pages/public/BeforeAfter";
import Reviews from "./pages/public/Reviews";
import Prices from "./pages/public/Prices";
import Appointment from "./pages/public/Appointment";
import Contact from "./pages/public/Contact";
import Privacy from "./pages/public/Privacy";
import Terms from "./pages/public/Terms";
import NotFound from "./pages/public/NotFound";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminAppointments from "./pages/admin/Appointments";
import AdminServices from "./pages/admin/Services";
import AdminDoctors from "./pages/admin/Doctors";
import AdminGallery from "./pages/admin/Gallery";
import AdminBeforeAfter from "./pages/admin/BeforeAfter";
import AdminReviews from "./pages/admin/Reviews";
import AdminPrices from "./pages/admin/Prices";
import AdminSettings from "./pages/admin/Settings";

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetails />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:slug" element={<DoctorDetails />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/before-after" element={<BeforeAfter />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/before-after" element={<AdminBeforeAfter />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/prices" element={<AdminPrices />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
