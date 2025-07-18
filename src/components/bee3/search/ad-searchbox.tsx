import AdSearchBoxDialog from "./ad-searchbox-dialog";
import AdSearchboxInput from "./ad-searchbox-input";

const AdSearch = () => {
  return (
    <>
      <div className="hidden lg:block">
        <AdSearchboxInput />
      </div>
      <div className="lg:hidden">
        <AdSearchBoxDialog />
      </div>
    </>
  );
};

export default AdSearch;
