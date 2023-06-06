import File from "./File";


function Files() {
  return (
    <>
      <div className="my-4">
        <h2 className="font-semibold text-2xl">Files</h2>
      </div>
      <div className="files">
        <File title="Title" source="source" date={new Date()} />
      </div>
    </>
  );
}

export default Files;
