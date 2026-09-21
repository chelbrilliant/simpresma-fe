import React from "react";
import { DashboardRole } from "./SimpresmaShared";
export default function DashboardPage({role}:{role:"Mahasiswa"|"Verifikator"|"Tendik"|"Wadek"|"Kaprodi"}){return <DashboardRole role={role}/>;}
