import { NextRequest, NextResponse } from "next/server";
import {
  CreateStock,
  DeleteStock,
  EditProductStock,
  EditStock,
  RemoveStockIdFromProducts,
} from "./utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { products, ...bodyWithoutProducts } = body;
  console.log("bodyWithoutProducts ", bodyWithoutProducts);
  const postData = await CreateStock(bodyWithoutProducts);

  if (postData) {
    EditProductStock(postData[0].uid, products);
    return NextResponse.json({ message: { postData } }, { status: 200 });
  }

  return NextResponse.json({ message: "error" }, { status: 500 });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { stock_id } = body;
  const postData = await DeleteStock(stock_id);

  if (postData) {
    return NextResponse.json({ message: "Stock deleted" }, { status: 200 });
  }

  return NextResponse.json({ message: "error" }, { status: 500 });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { stock_id, products, ...bodyWithoutuui } = body;
  const postData = await EditStock(stock_id, bodyWithoutuui);

  if (postData) {
    RemoveStockIdFromProducts(postData[0].uid);
    EditProductStock(postData[0].uid, products);
    return NextResponse.json({ message: { postData } }, { status: 200 });
  }

  return NextResponse.json({ message: "error" }, { status: 500 });
}
