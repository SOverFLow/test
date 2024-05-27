import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { searchPlugin } from "@react-pdf-viewer/search";
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { toast } from "react-toastify";
import sendInvoiceMail from "@/utils/sendMail";
import { useSelector } from "react-redux";
import { RootState } from "@/store";


interface IModalProps {
  onHideModal?: () => void
  url: string,
  modalShow: boolean
  modalClose: any
  Clientemail?: string
  invoiceUid?: string
}

const Modal = ({ modalShow, url, modalClose, Clientemail, invoiceUid }: IModalProps): JSX.Element => {
  // const fileUrl2 = `https://xuduivfvjgpofpmdsaaw.supabase.co/storage/v1/object/public/pdf/younes%20(3).pdf?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJwZGYveW91bmVzICgzKS5wZGYiLCJpYXQiOjE3MTM3OTQ1NzYsImV4cCI6MTcxNDM5OTM3Nn0.6eFfmWYb6aCXp4-A0IrvGFY7PBoeFVRS72LbM9lB5sI&t=2024-04-22T14%3A02%3A57.079Z`;

  const fileUrl2 = url;
  const searchPluginInstance = searchPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { ShowSearchPopoverButton } = searchPluginInstance;
  const handlePageChange = (e: any) => {
    localStorage.setItem("current-page", `${e.currentPage}`);
  };

  const {
    CurrentPageInput,
    GoToFirstPageButton,
    GoToLastPageButton,
    GoToNextPageButton,
    GoToPreviousPage
  } = pageNavigationPluginInstance;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const currentPage = localStorage.getItem("current-page");
  const initialPage = currentPage ? parseInt(currentPage, 10) : 0;
  const department = useSelector(
    (state: RootState) => state.departmentSlice.value
  );
  function fileUrl() {
    window.location.href = fileUrl2;
  }

  const handleSendEmail = () => {
    console.log('send email', Clientemail);
    if (Clientemail)
      {
        sendInvoiceMail({name:'sir', email:Clientemail,
     invoiceLink:fileUrl2, 
     confirmationLink:`${process.env.NEXT_PUBLIC_HOSTNAME}/${'fr'}/department/${department.uid}/invoices/${invoiceUid}/confirm`})
    toast.success('Email sent successfully',
      {
        position: "top-right",
      }
    );
    modalClose();
      }
    
  };
  return <> {

    <div
      className="modal">
      <button
        onClick={modalClose}
        className="modal-close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
     
      <button className="modal-email" onClick={() => handleSendEmail()}>
          <svg width="35px" height="35px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 9.00005L10.2 13.65C11.2667 14.45 12.7333 14.45 13.8 13.65L20 9" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3 9.17681C3 8.45047 3.39378 7.78123 4.02871 7.42849L11.0287 3.5396C11.6328 3.20402 12.3672 3.20402 12.9713 3.5396L19.9713 7.42849C20.6062 7.78123 21 8.45047 21 9.17681V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V9.17681Z" stroke="#fff" stroke-width="2" stroke-linecap="round"></path> </g></svg>      
      </button>

      <div className="modal-content">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div
            className="rpv-core__viewer viewer-wrapper"

          >
            <div className="top-bar"
            >
              <div style={{ padding: "0px 2px" }}>
                <ShowSearchPopoverButton />
              </div>
              <div style={{ padding: "0px 2px" }}>
                <GoToFirstPageButton />
              </div>
              <div style={{ padding: "0px 2px" }}>
                <GoToPreviousPage />
              </div>
              <div style={{ padding: "0px 2px" }}>
                <CurrentPageInput />
              </div>
              <div style={{ padding: "0px 2px" }}>
                <GoToNextPageButton />
              </div>
              <div style={{ padding: "0px 2px" }}>
                <GoToLastPageButton />
              </div>

            </div>

            <div style={{ height: "720px" }}>
              <Viewer
                fileUrl={`${fileUrl2}`}
                initialPage={initialPage}
                onPageChange={handlePageChange}
                plugins={[searchPluginInstance,defaultLayoutPluginInstance , pageNavigationPluginInstance]}
                defaultScale={0.8}
              />
            </div>
          </div>
        </Worker>
      </div>
    </div>
  }
  </>

}

export default Modal;