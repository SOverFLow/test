import { Box } from "@mui/material";
import { Button, Input, List, Popover } from "antd";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

type Product = {
  uid: string;
  name: string;
  image: string;
  price: number;
};

type ProductsSelecterProps = {
  tranlateObj: any;
  products: Product[];
  onChange: (updateFunction: (products: Product[]) => Product[]) => void;
  addedProducts?: Product[];
  disabled?: boolean;
};

const ProductsSelecter = ({
  tranlateObj,
  products,
  onChange,
  addedProducts = [],
  disabled = false,
}: ProductsSelecterProps) => {
  const t = useTranslations("");
  const buttonRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentProduct, setCurrentProduct] = useState<string>("");
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [productQuantities, setProductQuantities] = useState<{
    [uid: string]: number;
  }>({});
  const [productsList, setProductsList] = useState<Product[]>(products);

  useEffect(() => {
    setProductsList(products);
  }, [products]);

  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible);
  };

  const addedProductsRef = useRef(addedProducts);

  useEffect(() => {
    addedProductsRef.current = addedProducts;
  }, [addedProducts]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(buttonRef.current);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (anchorEl) {
        setAnchorEl(buttonRef.current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [anchorEl]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleProductSelect = (product: Product) => {
    setCurrentProduct(product.uid);
    const quantity = productQuantities[product.uid] || 1;
    setCurrentQuantity(quantity);
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    productUid: string
  ) => {
    const newQuantity = Number(event.target.value);
    setCurrentQuantity(newQuantity);
    setProductQuantities((prev) => ({
      ...prev,
      [productUid]: newQuantity,
    }));
  };

  const addProduct = (productUid: string) => {
    const quantity = productQuantities[productUid] || 1;
    if (quantity <= 0 || isNaN(quantity)) {
      toast.error(t("AddTaskForm.quantity_must_be_greater_than_zero"));
      return;
    }
    const selectedProduct = productsList.find((p) => p.uid === productUid);
    if (!selectedProduct) {
      toast.error(t("AddTaskForm.product_not_found"));
      return;
    }

    const newProduct = { ...selectedProduct, quantity };
    onChange((prev) => [...prev, newProduct]);
    setVisible(false);
  };

  const filteredProducts = productsList?.filter(
    (product) =>
      !addedProductsRef?.current?.some(
        (addedProduct) => addedProduct.uid === product.uid
      ) && product.name.toLowerCase().includes(searchQuery)
  );

  const content = (
    <Box
      sx={{
        maxWidth: { xs: 350, md: 480 },
        width: "100%",
        maxHeight: 400,
        overflowY: "scroll",
        padding: 1,
      }}
    >
      {filteredProducts.length > 0 && (
        <Input
          placeholder={tranlateObj.search}
          onChange={handleSearchChange}
          style={{
            marginBottom: 8,
            width: "100%",
            border: "1px solid #999999",
          }}
        />
      )}
      <List
        size="default"
        dataSource={filteredProducts}
        renderItem={(product: Product) => (
          <List.Item
            key={product.uid}
            actions={[
              <Input
                key={product.uid}
                type="number"
                value={currentProduct === product.uid ? currentQuantity : 1}
                onChange={(event) => handleQuantityChange(event, product.uid)}
              />,

              <Button
                key={product.uid}
                onClick={() => addProduct(product.uid)}
                style={{
                  backgroundColor: "#00acc1",
                  color: "white",
                  border: "none",
                }}
              >
                {tranlateObj.add}
              </Button>,
            ]}
            onClick={() => handleProductSelect(product)}
          >
            {product.name}
          </List.Item>
        )}
      />
    </Box>
  );

  return (
    <Popover
      zIndex={30000}
      content={content}
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      placement="bottom"
      style={{ padding: 4, width: "100%" }}
    >
      <Button
        aria-controls="product-menu"
        aria-haspopup="true"
        onClick={handleClick}
        style={{
          border: `1px solid #00acc1`,
          fontSize: "0.9rem",
          fontWeight: 550,
          width: "100%",
          padding: "0.3rem",
          height: "3rem",
          color: "white",
          backgroundColor: "#00acc1",
          textTransform: "none",
        }}
        // disabled={disabled}
      >
        {tranlateObj.desired_product}
      </Button>
    </Popover>
  );
};

export default ProductsSelecter;
