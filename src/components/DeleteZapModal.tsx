import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Trash2, AlertTriangle, Loader2, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface DeleteZapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zapId: string;
  onDeleteSuccess: () => void;
}

interface DeleteErrorResponse {
  success: false;
  message: string;
  error: string;
  retryAfter?: number;
}

export default function DeleteZapModal({
  open,
  onOpenChange,
  zapId,
  onDeleteSuccess,
}: DeleteZapModalProps) {
  const [deletionToken, setDeletionToken] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateTokenFormat = (token: string): boolean => {
    // Basic validation: token should not be empty and should have reasonable length
    return token.trim().length > 0;
  };

  const handleDelete = async () => {
    // Clear previous errors
    setError(null);

    // Validate token format before making API call
    if (!validateTokenFormat(deletionToken)) {
      setError("Please enter a valid deletion token");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/zaps/${zapId}`,
        {
          data: { deletionToken: deletionToken.trim() },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Success response (200)
      if (response.data.success) {
        toast.success("Zap deleted successfully", {
          description: "Your Zap has been permanently removed from the system.",
        });
        onOpenChange(false);
        onDeleteSuccess();
      }
    } catch (err) {
      const error = err as AxiosError<DeleteErrorResponse>;

      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 401:
            // Invalid or expired deletion token
            setError("Invalid or expired deletion token. Please check your token and try again.");
            toast.error("Invalid Token", {
              description: "The deletion token you provided is invalid or has expired.",
            });
            break;

          case 404:
            // Zap not found
            setError("This Zap no longer exists or has already been deleted.");
            toast.error("Zap Not Found", {
              description: "The Zap you're trying to delete doesn't exist.",
            });
            break;

          case 429:
            // Rate limit exceeded
            const retryAfter = data?.retryAfter || 900;
            const retryMinutes = Math.ceil(retryAfter / 60);
            setError(
              `Too many deletion attempts. Please try again in ${retryMinutes} minute${retryMinutes > 1 ? "s" : ""}.`
            );
            toast.error("Rate Limit Exceeded", {
              description: `Please wait ${retryMinutes} minute${retryMinutes > 1 ? "s" : ""} before trying again.`,
            });
            break;

          case 500:
            // Server error
            setError("Server error occurred. Please try again later.");
            toast.error("Server Error", {
              description: "Failed to delete Zap. Please try again later.",
            });
            break;

          default:
            // Unknown error
            setError(data?.message || "An unexpected error occurred. Please try again.");
            toast.error("Error", {
              description: "Failed to delete Zap. Please try again.",
            });
        }
      } else if (error.request) {
        // Network error - no response received
        setError("Network error. Please check your connection and try again.");
        toast.error("Network Error", {
          description: "Unable to connect to the server. Please check your internet connection.",
        });
      } else {
        // Other errors
        setError("An unexpected error occurred. Please try again.");
        toast.error("Error", {
          description: "Failed to delete Zap. Please try again.",
        });
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setDeletionToken("");
      setError(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-xl">Delete Zap</DialogTitle>
          </div>
          <DialogDescription className="text-base pt-2">
            This action cannot be undone. This will permanently delete your Zap
            and remove all associated data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning Alert */}
          <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-500">
                Warning: Permanent Deletion
              </p>
              <p className="text-xs text-muted-foreground">
                Enter your deletion token to confirm. The QR code and short link
                will stop working immediately.
              </p>
            </div>
          </div>

          {/* Deletion Token Input */}
          <div className="space-y-3">
            <Label htmlFor="deletion-token" className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Deletion Token
            </Label>
            <Input
              id="deletion-token"
              type="text"
              placeholder="Enter your deletion token"
              value={deletionToken}
              onChange={(e) => {
                setDeletionToken(e.target.value);
                if (error) setError(null);
              }}
              disabled={isDeleting}
              className="h-12 rounded-xl border-border bg-background font-mono text-sm"
              autoComplete="off"
              autoFocus
            />
            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || !deletionToken.trim()}
            className="rounded-xl"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Zap
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
