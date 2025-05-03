"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

const AdminDashboard = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null); // for modal preview

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await axios.get("/api/tools");
        setTools(response.data.tools);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching tools",
          description: error?.message || "Something went wrong.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const handleUpdateStatus = async (ownerId, status) => {
    try {
      const updated = await axios.patch("/api/tools", { ownerId, status });
      setTools((prev) =>
        prev.map((tool) =>
          tool._id === ownerId ? { ...tool, status: updated.data.status } : tool
        )
      );
      toast.success(`Tool ${status}`);
    } catch (error) {
      toast.error(`Something went wrong`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
            </div>
          ) : tools.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No tools submitted yet.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Tool Name</TableHead>
                    <TableHead>Price / Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
  {tools.map((tool) => (
    <TableRow key={tool._id}>
      <TableCell className="flex gap-2 flex-wrap">
        {tool.images?.length > 0 ? (
          tool.images.map((img, index) => (
            <Image
              key={index}
              width={64}
              height={64}
              src={img.url}
              alt={`${tool.name} image ${index + 1}`}
              className="w-16 h-16 object-cover rounded cursor-pointer"
              onClick={() => setPreviewImage(img.url)}
            />
          ))
        ) : (
          <Image
            width={64}
            height={64}
            src="/placeholder.png"
            alt="No image"
            className="w-16 h-16 object-cover rounded"
          />
        )}
      </TableCell>
      <TableCell>{tool.name}</TableCell>
      <TableCell>${tool.rentalRate}</TableCell>
      <TableCell>{tool.status}</TableCell>
      <TableCell>
        {tool.status === "Pending" ? (
          <div className="flex gap-2">
            <Button
              variant="success"
              onClick={() => handleUpdateStatus(tool._id, "Approved")}
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleUpdateStatus(tool._id, "Rejected")}
            >
              Reject
            </Button>
          </div>
        ) : (
          <Button variant="outline" disabled>
            Already {tool.status}
          </Button>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

              </Table>

              {/* Image Preview Modal */}
              {previewImage && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
                  <div className="relative max-w-4xl w-full">
                    <button
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 text-white bg-black rounded-full p-1 hover:bg-opacity-80"
                    >
                      <X size={24} />
                    </button>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full max-h-[90vh] mx-auto rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
