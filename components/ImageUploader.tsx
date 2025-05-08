"use client";

import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "./ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { ProductFormValues } from "@/app/[locale]/dashboard/products/schemas/productSchema";
import Image from "next/image";
import { type Image as UploadedImage } from "@/app/[locale]/types/global";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { ImagePlus, X } from "lucide-react";
import DeleteDialog2 from "./DeleteDialog2";
import authAxios from "@/app/[locale]/lib/authAxios";
import { toast } from "sonner";
import { useState, useEffect } from "react";

// Main component that manages the file input
export default function ImageUploader({
  form,
  uploadedImages,
}: {
  form: UseFormReturn<ProductFormValues>;
  uploadedImages?: UploadedImage[];
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    form.setValue("images", [...form.getValues("images"), ...files]);
  };

  const removeSelectedImage = (imageIndex: number) => {
    form.setValue(
      "images",
      form.getValues("images").filter((_image, index) => index !== imageIndex)
    );
  };

  return (
    <Card className="lg:col-span-1">
      <CardContent>
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Product Images
              </FormLabel>
              <FormControl>
                <div className="border rounded-lg p-4 bg-muted/20">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col gap-3 cursor-pointer bg-muted rounded-lg p-4"
                  >
                    <div className="flex flex-col items-center text-center py-2">
                      <ImagePlus className="h-6 w-6 mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Select Product Images
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>

                    <Input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer hidden"
                    />
                  </label>

                  {form.watch("images").length > 0 && (
                    <div className="mt-4 py-2 px-3 bg-muted rounded-md text-sm flex justify-between items-center">
                      <span className="font-medium">
                        {form.watch("images").length} image(s) selected
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs cursor-pointer bg-gray-200 hover:bg-gray-200/80"
                        onClick={() => form.setValue("images", [])}
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SelectedImagesContainer
          images={form.watch("images")}
          onRemove={removeSelectedImage}
        />

        <UploadedImagesContainer images={uploadedImages || []} />
      </CardContent>
    </Card>
  );
}

// Component for displaying and managing newly selected images
const SelectedImagesContainer = ({
  images,
  onRemove,
}: {
  images: File[];
  onRemove: (index: number) => void;
}) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-3">Selected Images</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-square rounded-md overflow-hidden border"
          >
            <Image
              priority
              src={URL.createObjectURL(image)}
              alt={image.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="h-7 w-7 absolute top-2 right-2 opacity-80 cursor-pointer"
              onClick={() => onRemove(index)}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-[10px] text-white truncate">
              {image.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for displaying and managing uploaded images
const UploadedImagesContainer = ({ images }: { images: UploadedImage[] }) => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>(images);

  // Update local state when props change
  useEffect(() => {
    setUploadedImages(images);
  }, [images]);

  const removeImage = (imageId: number): Promise<void> => {
    return authAxios
      .delete(`/files/${imageId}`)
      .then(() => {
        // Remove the deleted image from state
        setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Image deleted successfully");
      })
      .catch((error) => {
        console.log(error);

        toast.error("Failed to delete image");
      });
  };

  if (uploadedImages.length === 0) return null;

  return (
    <div className="mt-6">
      <Separator className="my-4" />
      <h3 className="text-sm font-medium mb-3">Uploaded Images</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {uploadedImages.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square rounded-md overflow-hidden border"
          >
            <Image
              priority
              src={image.url}
              alt={image.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
            <DeleteDialog2 action={() => removeImage(image.id)}>
              <Button
                variant="destructive"
                size="icon"
                className="h-7 w-7 absolute top-2 right-2 opacity-80 cursor-pointer"
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </DeleteDialog2>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-[10px] text-white truncate">
              {image.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
