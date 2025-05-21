import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import CreateTrip from "./create-trip/index.tsx";
import NotFound from "./NotFound/index.tsx";
import Header from "./components/custom/Header.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { ClerkProvider, Protect } from "@clerk/clerk-react";
import ViewTrip from "./view-trip/[tripId]/index.tsx";
// import { Button } from "./components/ui/button.tsx";
import SignInPage from "./sign-in/index.tsx";
import Footer from "./components/custom/Footer.tsx";
import MyTrips from "./components/my-trips/index.tsx";
// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<App />} />
          <Route path="create-trip" element={<CreateTrip />} />
          <Route path="create-trip" element={<CreateTrip />} />
          <Route path="signIn" element={<SignInPage />} />

          <Route
            path="view-trip/:userEmail/:tripId"
            element={
              <Protect
                fallback={
                  <div>
                    {/* {" "}
                    <p>Please Sign In to Continue</p>
                    <SignInButton mode="modal">
                      <Button>Sign In</Button>
                    </SignInButton> */}
                    <SignInPage />
                  </div>
                }
              >
                <ViewTrip />
              </Protect>
            }
          />
          <Route
            path="my-trips"
            element={
              <Protect
                fallback={
                  <div>
                    {/* {" "}
                    <p>Please Sign In to Continue</p>
                    <SignInButton mode="modal">
                      <Button>Sign In</Button>
                    </SignInButton> */}
                    <SignInPage />
                  </div>
                }
              >
                <MyTrips />
              </Protect>
            }
          />

          <Route path="/*" element={<NotFound />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </ClerkProvider>
    <Toaster />
  </StrictMode>
);
