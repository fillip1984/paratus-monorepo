import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/inbox");
}

//   return (
//     <div className="bg-warning m-1 flex flex-1 flex-col p-1 text-black">
//       <Heading />
//       <MainContent />
//     </div>
//   );
// }

// const Heading = () => (
//   <div className="bg-danger/30 m-1 flex items-center justify-between p-1">
//     <h4 className="font-bold">Welcome to Paratus!</h4>
//     <GiSettingsKnobs />
//   </div>
// );

// const MainContent = () => (
//   <div className="bg-success m-1 flex flex-1 flex-col p-1">
//     <p className="">
//       Your productivity journey starts here. Use the side navigation to explore
//       the app.
//     </p>
//   </div>
// );
