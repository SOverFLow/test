import { Box, Typography } from "@mui/material";

interface EmailTemplateProps {
  name: string;
  email: string;
  invoiceLink: string;
  confirmationLink: string;
}

export function EmailTemplate({
  name,
  email,
  invoiceLink,
  confirmationLink,
}: EmailTemplateProps) {
  return (
    <Box>
      <Typography variant="h6">Hi {name}!</Typography>
      <p>Votre facture est prête.</p>
      <Box display={"block"} component={"a"} href={invoiceLink}>
        Cliquez ici pour voir votre facture.
      </Box>
      <Box component={"a"} href={confirmationLink}>
        Cliquez ici pour confimer votre facture.
      </Box>
    </Box>
  );
}
