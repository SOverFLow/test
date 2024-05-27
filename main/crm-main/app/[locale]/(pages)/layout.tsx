"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//Redux / Supabase
import { setLang } from "@/store/langSlice";
import { setUser } from "@/store/userSlice";
import { createClient } from "@/utils/supabase/client";
//Custom Components
import NavBar from "@/components/layout/NavBar/NavBar";
import Main from "@/components/Main";
import SideBar from "@/components/layout/Sidebar";
import { Box, CircularProgress } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "@/store";

export default function PagesLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const supabase = createClient();
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state?.loadingSlice?.value);

  useEffect(() => {
    dispatch(setLang(locale));
    supabase.auth
      .getUser()
      .then((user) => {
        dispatch(setUser(user?.data));
      })
      .catch((e) => {
        dispatch(setUser(null));
        console.log("error", e);
      });
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        // console.log(`Auth event: ${event}`);
        if (event === 'SIGNED_IN') {
          // console.log('User signed in!', session);
        } else if (event === 'TOKEN_REFRESHED') {
          if (session){
            // console.log('Token refreshed!', session.access_token);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out!');
        }
      });
  
      return () => {
      listener.subscription.unsubscribe(); // Cleanup subscription on component unmount
      };
  });

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {loading && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            position: "absolute",
            zIndex: 100000,
          }}
        >
          <CircularProgress
            sx={{ position: "absolute", top: "50%", left: "50%" }}
          />
        </Box>
      )}
      <NavBar />
      <div style={{ display: "flex" }}>
        <SideBar />
        <ToastContainer/>
        <Main>{children}</Main>
      </div>
    </Box>
  );
}
