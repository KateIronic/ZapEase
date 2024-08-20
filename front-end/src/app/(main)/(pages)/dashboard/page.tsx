// "use client";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { BACKEND_URL, HOOKS_URL } from "../../../config";
// import { useRouter } from "next/navigation";

// interface Zap {
//   id: string;
//   triggerId: string;
//   userId: number;
//   actions: {
//     id: string;
//     zapId: string;
//     actionId: string;
//     sortingOrder: number;
//     type: {
//       id: string;
//       name: string;
//       image: string;
//     };
//   }[];
//   trigger: {
//     id: string;
//     zapId: string;
//     triggerId: string;
//     type: {
//       id: string;
//       name: string;
//       image: string;
//     };
//   };
// }

// function useZaps() {
//   const [loading, setLoading] = useState(true);
//   const [zaps, setZaps] = useState<Zap[]>([]);

//   useEffect(() => {
//     axios
//       .get(`${BACKEND_URL}/api/v1/zap`, {
//         headers: {
//           Authorization: localStorage.getItem("token"),
//         },
//       })
//       .then((res:any) => {
//         setZaps(res.data.zaps);
//         setLoading(false);
//       });
//   }, []);

//   return {
//     loading,
//     zaps,
//   };
// }

// export default function DashboardPage() {
//   const { loading, zaps } = useZaps();
//   const router = useRouter();

//   return (
//     <div>
//       <Appbar />
//       <div className="flex justify-center pt-8">
//         <div className="max-w-screen-lg	 w-full">
//           <div className="flex justify-between pr-8 ">
//             <div className="text-2xl font-bold">My Zaps</div>
//             <DarkButton
//               onClick={() => {
//                 router.push("/zap/create");
//               }}>
//               Create
//             </DarkButton>
//           </div>
//         </div>
//       </div>
//       {loading ? (
//         "Loading..."
//       ) : (
//         <div className="flex justify-center">
//           {" "}
//           <ZapTable zaps={zaps} />{" "}
//         </div>
//       )}
//     </div>
//   );
// }

// function ZapTable({ zaps }: { zaps: Zap[] }) {
//   const router = useRouter();

//   return (
//     <div className="p-8 max-w-screen-lg w-full">
//       <div className="flex">
//         <div className="flex-1">Name</div>
//         <div className="flex-1">ID</div>
//         <div className="flex-1">Created at</div>
//         <div className="flex-1">Webhook URL</div>
//         <div className="flex-1">Go</div>
//       </div>
//       {zaps.map((z) => (
//         <div className="flex border-b border-t py-4" key={z.id}>
//           <div className="flex-1 flex">
//             <img
//               src={z.trigger.type.image}
//               className="w-[30px] h-[30px]"
//               alt=""
//             />{" "}
//               <img
//                 src={x.type.image}
//                 className="w-[30px] h-[30px]"
//                 alt=""
//               />className="w-[30px] h-[30px]"
//               />
//             ))}
//           </div>
//           <div className="flex-1">{z.id}</div>
//           <div className="flex-1">Nov 13, 2023</div>
//           <div className="flex-1">{`${HOOKS_URL}/hooks/catch/1/${z.id}`}</div>
//           <div className="flex-1">
//             <LinkButton
//               onClick={() => {
//                 router.push("/zap/" + z.id);
//               }}>
//               Go
//             </LinkButton>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

import React from "react";

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-4 relative">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        Dashboard
      </h1>
    </div>
  );
};

export default DashboardPage;
