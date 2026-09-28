"use client";

import { colors, modalHeadingClassName, type } from "@/lib/theme";

type Props = {
  open: boolean;
  name: string;
  attending: boolean | null;
  done: boolean;
  submitting: boolean;
  onClose: () => void;
  onNameChange: (v: string) => void;
  onAttendingChange: (v: boolean) => void;
  onSubmit: () => void;
};

export function RsvpModal({
  open,
  name,
  attending,
  done,
  submitting,
  onClose,
  onNameChange,
  onAttendingChange,
  onSubmit,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-black/50 sm:p-4">
      <div
        className="modal-sheet w-full sm:max-w-lg bg-[#FFFAF7] shadow-xl max-h-[90vh] overflow-y-auto sm:rounded-2xl"
        role="dialog"
        aria-labelledby="rsvp-title"
      >
        <div className="relative bg-[#404A1D] px-6 pt-6 pb-4 text-center text-white">
          <button
            type="button"
            aria-label="Đóng"
            className="absolute right-3 top-3 w-8 h-8 rounded-full text-white/80 hover:text-white hover:bg-white/20"
            onClick={onClose}
          >
            ✕
          </button>
          <h2
            id="rsvp-title"
            className={modalHeadingClassName()}
            style={{ textShadow: "rgba(0,0,0,0.2) 1px 1px 2px" }}
          >
            Xác nhận tham dự
          </h2>
        </div>
        <div className={`p-5 sm:p-6 space-y-4 text-[#404A1D] ${type.bodyUi}`}>
          {done ? (
            <p className="text-center py-8 text-sm">Cảm ơn bạn! Xác nhận của bạn đã được ghi nhận.</p>
          ) : (
            <>
              <p className="text-xs text-center opacity-80 leading-relaxed">
                Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi. Xin xác
                nhận để chúng tôi chuẩn bị chu đáo nhất.
              </p>
              <label className="block text-sm font-medium">
                Tên của bạn
                <input
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="Nhập tên của bạn"
                  className="mt-1.5 w-full rounded-xl border border-[#404A1D22] bg-white px-4 py-3 text-sm font-normal outline-none focus:border-[#404A1D55]"
                />
              </label>
              <p className="text-sm font-medium">Bạn sẽ đến chứ?</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 rounded-xl border border-[#404A1D22] bg-white/50 px-4 py-3.5 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="attending"
                    checked={attending === true}
                    onChange={() => onAttendingChange(true)}
                  />
                  Tôi sẽ đến
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-[#404A1D22] bg-white/50 px-4 py-3.5 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="attending"
                    checked={attending === false}
                    onChange={() => onAttendingChange(false)}
                  />
                  Rất tiếc, tôi không thể đến
                </label>
              </div>
              <button
                type="button"
                disabled={submitting || !name.trim() || attending === null}
                onClick={onSubmit}
                className="w-full rounded-full py-3.5 text-sm font-semibold text-white disabled:opacity-40 transition-opacity"
                style={{ backgroundColor: colors.modalSubmit }}
              >
                Gửi xác nhận
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
