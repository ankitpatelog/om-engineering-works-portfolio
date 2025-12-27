
import React from 'react'
import connectToDatabase from "@/library/mongoDb";
import Company from "@/models/companyModel"
import CompanyDetailsRequired from '../../generate-bill-components/addcomapnymsg';
import toast , {Toaster} from "red-hot-toast"
import { useSession } from "next-auth/react";
import { useState } from 'react';

const editcompanydetails = () => {
  const { data: session } = useSession();
  const [havedetail, sethavedetail] = useState(true)

  const handlelayout = (e) => {
    <Toaster/>
    try {
      const connection = connectToDatabase();

      if(!connection){
        toast.error("backend connection failad pls login after some time ")
      }

      //if conn is proper
      const companyid = session.user?.id//company id is same as the user ._id stored at the time of mongodb login
      const userid = Company.findById({ _id: companyid })
      if (companyid!==userid) {
        sethavedetail(false)//it means Company model is not created and the user need to fill the form and create his copany id
      }



    } catch (error) {
      
    }
  }
  
  
  return (
    <div>this is edit company details section</div>
    {handlelayout}
    {havedetail && <CompanyDetailsRequired/>}

  )
}

export default editcompanydetails