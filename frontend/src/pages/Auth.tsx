import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HardHat } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup State
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"details" | "otp">("details");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.login({ username: loginEmail, password: loginPassword });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success(`Welcome back, ${data.username}!`);
      if (data.role === 'admin') {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.sendOtp(signupEmail);
      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.verifySignup({
        email: signupEmail,
        password: signupPassword,
        otp,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 flex items-center justify-center min-h-screen px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <HardHat className="h-12 w-12 text-primary mx-auto mb-3" />
            <h1 className="font-heading text-2xl text-foreground">
              WELCOME TO <span className="text-primary">HEAVYBUILD</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Access your account or create one</p>
          </div>

          <div className="bg-surface-dark border border-primary/20 p-6 rounded-lg">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">LOGIN</TabsTrigger>
                <TabsTrigger value="signup">SIGN UP</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email / Username</label>
                    <input
                      required
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded focus:border-primary focus:outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Password</label>
                    <input
                      required
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border rounded focus:border-primary focus:outline-none"
                      placeholder="Enter your password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {loading ? "LOGGING IN..." : "LOGIN"}
                  </button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                {step === "details" ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Email Address</label>
                      <input
                        required
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded focus:border-primary focus:outline-none"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Password</label>
                      <input
                        required
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded focus:border-primary focus:outline-none"
                        placeholder="Create a password"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {loading ? "SEND OTP" : "SEND OTP"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground">OTP sent to {signupEmail}</p>
                      <button
                        type="button"
                        onClick={() => setStep("details")}
                        className="text-xs text-primary hover:underline"
                      >
                        Change Email
                      </button>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Enter OTP</label>
                      <input
                        required
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded focus:border-primary focus:outline-none text-center tracking-[0.5em] text-lg"
                        placeholder="------"
                        maxLength={6}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-primary text-primary-foreground font-heading text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {loading ? "VERIFY & SIGN UP" : "VERIFY & SIGN UP"}
                    </button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
