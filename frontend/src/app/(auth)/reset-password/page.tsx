import ResetPasswordForm from "./_components/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const token = query.token ? (query.token as string) : "";

  return <ResetPasswordForm token={token} />;
}