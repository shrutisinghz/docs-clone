import { Editor } from "../editor";
// To fetch the data from documentID
interface DocumentIdPageProps {
    params: Promise< {documentId: string} >
}
const DocumentIdPage = async ({ params} : DocumentIdPageProps ) => {
    const { documentId } = await params;
   
  return (
    <div className="min-h-screen bg-red-100">  
      <Editor />
    </div>
  )
}

export default DocumentIdPage;