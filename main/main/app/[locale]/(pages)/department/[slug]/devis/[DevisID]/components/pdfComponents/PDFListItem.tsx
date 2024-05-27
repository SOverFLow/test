import { useState } from "react";
import Modal from "./Modal";
interface IPDFList {
  title: string;
  description?: string;
  url: string;
  path?: string;
  tags?: string[]
}

const PDFListItem: React.FC<IPDFList> = ({ title, tags, path, url, description }: IPDFList) => {

  const [showModal, setShowModal] = useState<boolean>(false)



  return (
    <>
      <div onClick={() => setShowModal(!showModal)} className='box' title="Click to details">
        <img src="/pdf.svg" alt="pdf" className="w-12 mx-auto block mb-3" />
        <div className="f">
          <h6 className='text-xl mb-1'> {title} </h6>
          <p className="text-sm">{description}</p>
        </div>
      </div>
      {showModal ? 
      <Modal modalShow={showModal} 
      modalClose={() => setShowModal(false)} 
      url={url} /> :null}
    </>
  )
}

export default PDFListItem