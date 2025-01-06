import Editor from "../editor";
import Toolbar from "./toolbar";
// To fetch the data from documentID
interface DocumentIdPageProps {
    params: Promise< {documentId: string} >
}
const DocumentIdPage = async ({ params} : DocumentIdPageProps ) => {
    const { documentId } = await params;
    console.log(documentId);
  return (
    
    <div className="min-h-screen bg-[#FAFBFD] flex flex-col gap-36 ">  
      <Toolbar />
      <Editor />
    </div>
  )
}

export default DocumentIdPage;