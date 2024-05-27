// import { CompanyInfoSchema } from "@/schemas/zod/zod.CompanyInfo";
import convertImageToWebP from "@/utils/webPconverter";
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  Skeleton,
  Typography,
} from "@mui/material";
import axios from "axios";
import { MuiTelInput } from "mui-tel-input";
import { useTranslations } from "next-intl";
import {
  ChangeEvent,
  FormEventHandler,
  useEffect,
  useState,
  useTransition,
} from "react";
import TabAvatar from "../../Items/TabAvatar";
import TableForm from "../../Items/TableForm";
import { TabParagraph } from "../../Items/TabParagraph";
import { TabSelect } from "../../Items/TabSelect";
import { TabSubTitle } from "../../Items/TabSubTitle";
import TextInput from "../../Items/textInput";

import AlternateEmailOutlinedIcon from "@mui/icons-material/AlternateEmailOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { grey } from "@mui/material/colors";
import updateCompanyInfo from "@/app/api/settings/actions/update_company_info";
import getCompanyInfo from "@/app/api/settings/actions/get_company_info";
import { useZodCompanyInfoSchema } from "@/schemas/zod/zod.CompanyInfo";
type FormData = {
  [x: string]: any;
};

export default function CompanyTab() {
  const [formData, setFormData] = useState<FormData>({});
  const t = useTranslations("SettingsPage.CompanyTab");

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Array<string>>([]);
  const [errors, setErrors] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isProfileReady, startTransitionProfile] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const CompanyInfoSchema = useZodCompanyInfoSchema();

  // function convertWebPToPNG(webpUrl: string): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const img = new Image();
  //     img.crossOrigin = "Anonymous"; // This enables CORS for the image
  //     img.src = webpUrl;

  //     img.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       canvas.width = img.width;
  //       canvas.height = img.height;
  //       const ctx = canvas.getContext("2d");
  //       if (ctx) {
  //         ctx.drawImage(img, 0, 0);
  //         resolve(canvas.toDataURL("image/png"));
  //       } else {
  //         reject(new Error("Failed to get canvas context"));
  //       }
  //     };

  //     img.onerror = (err) => {
  //       reject(err);
  //     };
  //   });
  // }

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.files) {
      // for file input
      const target = e.target as HTMLInputElement & { files: FileList };
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setFormData({ ...formData, companyLogo: file });
      }
    } else {
      // for other inputs
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrors("");
    setSuccess("");
    const result = CompanyInfoSchema.safeParse(formData);
    if (result.success === false) {
      // console.log("formData", formData);
      console.log("++", result.error.errors[0].message),
        setErrors(result.error.errors[0].message);
      return;
    }
    const form = new FormData();
    for (const key of Object.keys(formData)) {
      if (key === "companyLogo" && formData[key]) {
        const imageWebP: any = await convertImageToWebP(formData[key]);
        formData[key] = imageWebP;
      }
      const value = formData[key];
      form.append(key, value);
    }
    startTransition(() => {
      updateCompanyInfo(form).then((data) => {
        if (data?.error) {
          setErrors(data.error);
        } else {
          setSuccess(data.success);
        }
      });
    });
    console.log("formData", formData);
  };

  useEffect(() => {
    async function getData() {
      startTransitionProfile(() => {
        getCompanyInfo().then((data: any) => {
          if (data?.error) {
            setErrors(data.error);
          } else {
            const res = data?.success;
            console.log("res", res);
            if (!res) return;
            setFormData({
              name: res.name ?? "",
              email: res.email ?? "",
              phone: res.phone ?? "",
              address: res.address ?? "",
              website: res.website ?? "",
              note: res.note ?? "",
              siret: res.siret ?? "",
              capital: res.capital ?? "",
              conditions_bank: res.conditions_bank ?? "",
            });
            if (res.logo) {
              // Usage example:
              // convertWebPToPNG(res.logo)
              //   .then((pngDataUrl) => {
              //     console.log("pngDataUrl", pngDataUrl); // This will log the PNG data URL
              //     setImagePreview(pngDataUrl);
              //   })
              //   .catch((err) => {
              //     console.error("Error converting image:", err);
              //   });
              setImagePreview(res.logo);
            }
          }
        });
      });
    }
    getData();
  }, []);

  function onSelectAdress(value: string | null) {
    if (!value) return;
    setFormData({ ...formData, ["address"]: value });
    setSearch(value!);
  }

  // for adress suggestions
  useEffect(() => {
    if (search) {
      const fetchSuggestions = async () => {
        try {
          const result = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              search
            )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
          );
          setSuggestions(
            result.data.features.map(
              (feature: { place_name: any }) => feature.place_name
            )
          );
        } catch (error) {
          console.error(error);
        }
      };
      fetchSuggestions();
    }
  }, [search]);

  return (
    <Grid justifyContent={"center"}>
      <Grid container>
        <Grid item sx={{ m: 2, mb: 0 }} xs={12} md={10}>
          <TabParagraph sx={{ mx: 1, mb: 2, py: 0, width: "100%" }}>
            {t("companytabdescription")}
          </TabParagraph>

          <TableForm title={t("company-organization")}>
            <FormControl
              noValidate
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              {/* company pictures */}
              <Box sx={{ mb: 2 }}>
                <TabSubTitle sx={{ mb: 1 }}>
                  {" "}
                  {t("profile-picture")}
                </TabSubTitle>
                {!isProfileReady ? (
                  <TabAvatar
                    handleChange={handleChange}
                    name={"companyLogo"}
                    imgUrl={imagePreview}
                  />
                ) : (
                  <Skeleton variant="circular">
                    <TabAvatar
                      imgUrl={imagePreview}
                      handleChange={handleChange}
                      name={"companyLogo"}
                    />
                  </Skeleton>
                )}
              </Box>

              {/* change profile adress */}
              <Box sx={{ mb: 2 }}>
                <TabSubTitle> {t("city")} </TabSubTitle>
                <TabSelect
                  placeholder={t("enter-your-city-name")}
                  isSearch={true}
                  default={formData.address ?? ""}
                  itemsList={suggestions}
                  onInputChange={(event, value) => {
                    setSearch(value);
                  }}
                  onSelect={onSelectAdress}
                />

                <TabParagraph sx={{ mt: 0, mb: 0, mr: 2 }}>
                  {t(
                    "start-typing-and-choose-from-a-suggested-city-to-help-others-find-you"
                  )}
                </TabParagraph>
              </Box>

              {/* company name */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "& .hover": { backgroundColor: "red" },
                }}
              >
                <TabSubTitle sx={{ mr: 2, width: "20%" }}>
                  {t("yourname")}
                </TabSubTitle>
                <TextInput
                  name="name"
                  value={formData.name}
                  handleChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder={t("your-company-name")}
                />
              </Box>

              {/* company Email */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "& .hover": { backgroundColor: "red" },
                }}
              >
                <TabSubTitle sx={{ mr: 2, width: "20%" }}>Email</TabSubTitle>
                <TextInput
                  name="email"
                  value={formData.email}
                  handleChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmailOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder={t("your-company-email")}
                />
              </Box>
              {/* company phone */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TabSubTitle sx={{ mr: 2, width: "20%" }}>
                  {t("phone")}
                </TabSubTitle>
                <PhoneInput
                  placeholder={t("your-company-phone-number")}
                  specialLabel=""
                  inputStyle={{
                    width: "100%",

                    height: "2.8rem",
                    borderRadius: 0,
                    backgroundColor: grey[100],
                  }}
                  country={"fr"}
                  value={formData.phone}
                  onChange={(phone) => setFormData({ ...formData, phone })}
                />
              </Box>
              {/* company website */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TabSubTitle sx={{ mr: 2, width: "20%" }}>
                  {t("website")}
                </TabSubTitle>
                <TextInput
                  name="website"
                  value={formData.website}
                  handleChange={handleChange}
                  placeholder={t("your-company-website-link")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LaunchOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              {/* siret capital conditions_bank */}
              {/* company siret */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "& .hover": { backgroundColor: "red" },
                }}
              >
                <TabSubTitle sx={{ mr: 2, width: "20%" }}>siret</TabSubTitle>
                <TextInput
                  name="siret"
                  value={formData.siret}
                  handleChange={handleChange}
                  placeholder="your company siret"
                />
              </Box>
              {/* capital name */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "& .hover": { backgroundColor: "red" },
                }}
              >
                <TabSubTitle sx={{ mr: 2, width: "20%" }}>capital</TabSubTitle>
                <TextInput
                  name="capital"
                  value={formData.capital}
                  handleChange={handleChange}
                  placeholder="your company capital"
                />
              </Box>
              {/* company conditions bank */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "& .hover": { backgroundColor: "red" },
                }}
              >
                <TabSubTitle sx={{ mr: 2, width: "20%" }}>
                  conditions bank
                </TabSubTitle>
                <TextInput
                  name="conditions_bank"
                  value={formData.conditions_bank}
                  handleChange={handleChange}
                  placeholder={"your company conditions bank"}
                />
              </Box>
              {/* company note */}
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TabSubTitle sx={{ mr: 2, mt: 1.5, width: "20%" }}>
                  {t("about")}{" "}
                </TabSubTitle>
                <TextInput
                  multiline
                  name="note"
                  value={formData.note}
                  handleChange={handleChange}
                  placeholder={t("notes-about-your-company-organization")}
                />
              </Box>

              {/* for Error and Successs messages */}
              {success! && (
                <Alert
                  sx={{
                    width: "95%",
                    mb: 1,
                  }}
                  severity="success"
                >
                  {success}
                </Alert>
              )}
              {errors! && (
                <Alert
                  sx={{
                    display: "flex",
                    width: "95%",
                    mb: 1,
                  }}
                  severity="error"
                >
                  {errors}
                </Alert>
              )}

              {/* save Changes */}
              <Box sx={{ mb: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, width: "fit-content" }}
                  disabled={isPending}
                >
                  <Typography variant="body2" color={"white"}>
                    {t("save-changes")}
                  </Typography>
                </Button>
              </Box>

              {/* ================ */}
            </FormControl>
          </TableForm>
        </Grid>
      </Grid>
    </Grid>
  );
}
