import PDFListItem from "./PDFListItem";

interface IPDFList {
  title: string;
  description?: string;
  url: string;
  path?: string;
  tags?: string[]
}


interface PDFLists {
  lists: IPDFList[]
}

const PDFList: React.FC<PDFLists> = ({ lists }: PDFLists) => {
  return (
    <div className="grid">
      {lists?.map((list, i) => {
        return <PDFListItem key={i} title={list.title} url={list.url} description={list.description} path={list.path} tags={list.tags} />
      })}

    </div>
  )
}

export default PDFList