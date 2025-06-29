import AdSearchBoxDialog from "./ad-searchbox-dialog";
import AdSearchboxInput from "./ad-searchbox-input";

const AdSearch = () => {
  return (
    <>
      <div className="hidden md:block">
        <AdSearchboxInput />
      </div>
      <div className="md:hidden">
        <AdSearchBoxDialog />
      </div>
    </>
  );
};

export default AdSearch;
