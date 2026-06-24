import { useState } from "react";
import { API_BASE_URL } from "../../utils/storefront";

export default function ZaloPayButton({
  amount,
  orderInfo,
  appUser = "guest",
  onSuccess,
  onError,
}) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/zalopay/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount) || 0,
          orderInfo,
          appUser,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || data || "Không tạo được thanh toán ZaloPay.");
      }

      const orderUrl = data?.order_url || data?.orderUrl;
      const transactionToken = data?.zp_trans_token || data?.transaction_token;

      if (orderUrl) {
        window.open(orderUrl, "_blank", "noopener,noreferrer");
        onSuccess?.({ ...data, opened: "order_url" });
        return;
      }

      if (transactionToken) {
        onSuccess?.(data);
        return;
      }

      throw new Error("ZaloPay sandbox chưa trả về order_url hoặc token.");
    } catch (error) {
      console.error(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="mt-4 block w-full rounded-xl bg-[#0B9BF2] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#0A85C9] disabled:opacity-50"
      onClick={handlePay}
      disabled={loading}
    >
      {loading ? "Đang mở ZaloPay..." : "Thanh toán ZaloPay"}
    </button>
  );
}
