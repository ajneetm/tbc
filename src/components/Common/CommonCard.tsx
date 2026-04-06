export default function CommonCard({ children }: any) {
  return (
    <div className="mx-auto w-full rounded-xl border px-6 py-10 sm:p-[70px]">
      {children}
    </div>
  );
}
