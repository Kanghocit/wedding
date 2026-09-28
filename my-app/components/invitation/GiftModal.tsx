"use client";

import { vietQrImageUrl } from "@/lib/config";
import type { BankAccount } from "@/lib/types";
import { modalHeadingClassName, type } from "@/lib/theme";

type Props = {
  open: boolean;
  banks: BankAccount[];
  onClose: () => void;
};

export function GiftModal({ open, banks, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-black/50 sm:p-4">
      <div className="modal-sheet w-full sm:max-w-xl bg-[#FFFAF7] shadow-xl max-h-[90vh] overflow-y-auto sm:rounded-2xl">
        <div className="relative bg-[#404A1D] px-6 pt-6 pb-4 text-center text-white">
          <button
            type="button"
            aria-label="Đóng"
            className="absolute right-3 top-3 w-8 h-8 rounded-full text-white/80 hover:bg-white/20"
            onClick={onClose}
          >
            ✕
          </button>
          <h2
            className={modalHeadingClassName()}
            style={{ textShadow: "rgba(0,0,0,0.2) 1px 1px 2px" }}
          >
            Hộp Quà Mừng
          </h2>
        </div>
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 justify-center flex-wrap text-[#404A1D]">
          {banks.map((bank) => {
            const qr = vietQrImageUrl(bank.bankCode, bank.accountNumber);
            const label =
              bank.role === "groom"
                ? `Chú Rể - ${bank.accountName}`
                : `Cô Dâu - ${bank.accountName}`;
            return (
              <div
                key={bank.accountNumber}
                className="flex flex-col items-center flex-1 max-w-[180px] mx-auto sm:max-w-none"
              >
                <h3 className="mb-2 text-xs min-h-[2rem] flex items-start justify-center font-medium text-center line-clamp-2 font-[family-name:var(--font-montserrat)]">
                  {label}
                </h3>
                <div
                  className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-xl p-2 shadow-lg flex items-center justify-center"
                  style={{ border: "2px solid rgba(64, 74, 29, 0.125)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qr} alt={`QR ${label}`} className="w-full h-full object-contain" />
                </div>
                <div className="mt-2 text-center space-y-0.5 font-[family-name:var(--font-montserrat)]">
                  <p className="text-[10px]">{bank.bankName}</p>
                  <p className="text-[10px] font-mono">{bank.accountNumber}</p>
                  <p className="text-[10px] font-semibold">{bank.accountName}</p>
                </div>
                <button
                  type="button"
                  className="mt-1.5 text-[10px] px-2 py-1 inline-flex items-center gap-1 font-medium rounded-full transition-colors bg-[#404A1D15]"
                  onClick={() => void navigator.clipboard.writeText(bank.accountNumber)}
                >
                  Sao chép STK
                </button>
                <a
                  href={qr}
                  download={`qr-${bank.role}.png`}
                  className="mt-1 text-[10px] underline opacity-70"
                >
                  Lưu QR
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
