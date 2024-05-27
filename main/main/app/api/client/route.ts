import { NextRequest, NextResponse } from "next/server";
import {
  CreateUserClient,
  DeleteUserClient,
  EditUserClient,
  addClientToBien,
  addContractUserClient_relation,
  addDepartmentClient_relation,
  addServiceUserClient_relation,
} from "./utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    email,
    password,
    department_id,
    bien_id,
    contract_id,
    service_id,
    ...bodyWithouemail
  } = body;

  try {
    const postData = await CreateUserClient(email, password, bodyWithouemail);

    if (postData && "error" in postData) {
      return NextResponse.json(
        { message: postData.error },
        { status: postData.code }
      );
    }

    if (postData) {
      const bodyForDepartmentClient = {
        department_id: department_id,
        client_id: postData.user?.id,
      };

      if (contract_id) {
        const bodyForContractUserClient = {
          user_client_id: postData.user?.id,
          contract_id: contract_id,
        };
        await addContractUserClient_relation(bodyForContractUserClient);
      } else if (service_id) {
        const bodyForServiceUserClient = {
          user_client_id: postData.user?.id,
          service_id: service_id,
        };
        await addServiceUserClient_relation(bodyForServiceUserClient);
      }
      await addClientToBien(postData.user?.id, bien_id);
      await addDepartmentClient_relation(bodyForDepartmentClient);
      console.log("postData: ", postData);
      return NextResponse.json({ message: { postData } }, { status: 201 });
    }

    return NextResponse.json({ message: "error" }, { status: 500 });
  } catch (e) {
    console.log("error: ", e);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { client_id } = body;

  try {
    const postData = await DeleteUserClient(client_id);

    if (postData && "error" in postData) {
      return NextResponse.json(
        { message: postData.error },
        { status: postData.code }
      );
    }

    if (postData) {
      return NextResponse.json({ message: "client deleted" }, { status: 200 });
    }

    return NextResponse.json({ message: "error" }, { status: 500 });
  } catch (e) {
    console.log("error: ", e);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const {
    email,
    user_id,
    bien_id,
    contract_id,
    service_id,
    ...bodyWithouemail
  } = body;

  try {
    const postData = await EditUserClient(email, user_id, bodyWithouemail);

    if (postData && "error" in postData) {
      return NextResponse.json(
        { message: postData.error },
        { status: postData.code }
      );
    }

    if (postData) {
      if (contract_id) {
        const bodyForContractUserClient = {
          user_client_id: postData.user?.id,
          contract_id: contract_id,
        };
        await addContractUserClient_relation(bodyForContractUserClient);
      } else if (service_id) {
        const bodyForServiceUserClient = {
          user_client_id: postData.user?.id,
          service_id: service_id,
        };
        await addServiceUserClient_relation(bodyForServiceUserClient);
      }
      await addClientToBien(postData.user?.id, bien_id);

      return NextResponse.json({ message: { postData } }, { status: 200 });
    }

    return NextResponse.json({ message: "error" }, { status: 500 });
  } catch (e) {
    console.log("error: ", e);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}
