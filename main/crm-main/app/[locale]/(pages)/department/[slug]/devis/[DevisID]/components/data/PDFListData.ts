/******************************************************************************
 * @Author                : a-str-o<younes.elguer@gmail.com>                  *
 *                                                                            *
 *                                                                            *
 *****************************************************************************/

interface IPDFList {
  title: string;
  description?: string;
  url: string;
  path?: string;
  tags?: string[]
}

export const Data: IPDFList[] = [
  {
    title: "livret d'accueil",
    description: "livret d'accueil",
    url: "younes.pdf",
    path: "path"
  },
  {
    title: "feuille de présence",
    description:"feuille de présence",
    url: "younes.pdf",
    path: "path"
  },
  {
    title: "attestation de formation",
    description:"attestation de formation",
    url: "younes.pdf",
    path: "path"
  },
  {
    title:"évaluation à chaud",
    description: "évaluation à chaud",
    url: "younes.pdf",
    path: "path"
  }
]