"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Hotel, Room } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"
import Image from "next/image"
import { Loader2, PencilLine, XIcon } from "lucide-react"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import axios from "axios"
import { useToast } from "../ui/use-toast"
import { UploadButton } from "../Uploadthings"
import { useRouter } from "next/navigation"

interface AddRoomFormProps {
    hotel?: Hotel & {
        rooms: Room[]
    }
    room?: Room
    handleDialogOpen: () => void
}

const formSchema = z.object({
    title: z.string().min(3, {
        message: "Title must be atleast 3 character long"
    }),
    description: z.string().min(10, {
        message: "Description must be atleast 10 character long"
    }),
    bedCount: z.coerce.number().min(1, { message: 'Bed count is required' }),
    guestCount: z.coerce.number().min(1, { message: 'Guest count is required' }),
    bathroomCount: z.coerce.number().min(1, { message: 'Bathroom count is required' }),
    kingBed: z.coerce.number().min(0),
    queenBed: z.coerce.number().min(0),
    image: z.string().min(1, {
        message: 'Image is required.'
    }),
    breakFastPrice: z.coerce.number().optional(),
    roomPrice: z.coerce.number().min(1, { message: ' Room price is required' }),
    roomService: z.coerce.boolean().optional(),
    TV: z.coerce.boolean().optional(),
    balcony: z.coerce.boolean().optional(),
    freeWifi: z.coerce.boolean().optional(),
    cityView: z.coerce.boolean().optional(),
    oceanView: z.coerce.boolean().optional(),
    forestView: z.coerce.boolean().optional(),
    mountainView: z.coerce.boolean().optional(),
    airCondition: z.coerce.boolean().optional(),
    soundProofed: z.coerce.boolean().optional(),
});

const AddRoomForm = ({ hotel, room, handleDialogOpen }: AddRoomFormProps) => {
    const [image, setImage] = useState<string | undefined>(room?.image);
    const [imageIsDeleting, setImageIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: room || {
            title: "",
            description: "",
            bedCount: 0,
            guestCount: 0,
            bathroomCount: 0,
            kingBed: 0,
            queenBed: 0,
            image: "",
            breakFastPrice: 0,
            roomPrice: 0,
            roomService: false,
            TV: false,
            balcony: false,
            freeWifi: false,
            cityView: false,
            oceanView: false,
            forestView: false,
            mountainView: false,
            airCondition: false,
            soundProofed: false,
        },
    });

    useEffect(() => {
        if (typeof image == 'string') {
          form.setValue('image', image, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          })
        }
      }, [image]);

    const handleImageDelete = (image: string) => {
        setImageIsDeleting(true);
        const imageKey = image.substring(image.lastIndexOf('/') + 1);
        axios.post('/api/uploadthing/delete', { imageKey }).then((res: any) => {
            if (res.data.success) {
                setImage("");
                toast({
                    variant: 'success',
                    description: 'Image remove'
                });
            }
        }).catch(() => {
            toast({
                variant: 'destructive',
                description: 'Something went wrong'
            });
        }).finally(() => {
            setImageIsDeleting(false);
        });
    };

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        if (hotel && room) {
          axios.patch(`/api/room/${room.id}`, values).then((res: any) => {
            toast({
              variant: 'success',
              description: 'Room updated'
            });
            router.refresh();
            setIsLoading(false);
            handleDialogOpen();
          }).catch((err) => {
            toast({
              variant: 'destructive',
              description: 'Something went wrong!'
            });
            setIsLoading(false);
          });
        } else {
            if(!hotel?.id) return;  
          axios.post('/api/room', {...values, hotelId: hotel.id}).then((res: any) => {
            toast({
              variant: 'success',
              description: 'Room created'
            });
            router.refresh();
            setIsLoading(false);
            handleDialogOpen();
          }).catch((err) => {
            toast({
              variant: 'destructive',
              description: 'Something went wrong!'
            });
            setIsLoading(false);
          });
        }
      };

    return (
        <div className=" max-h-[75px] overflow-y-auto px-2">
            <Form {...form} >
                <form className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Room Title *</FormLabel>
                                <FormDescription>
                                    Provide your room name
                                </FormDescription>
                                <FormControl>
                                    <Input placeholder="Double Room" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Room description *</FormLabel>
                                <FormDescription>
                                    Is there anything special about this room?
                                </FormDescription>
                                <FormControl>
                                    <Textarea placeholder="Have a beautiful view of the ocean while in this room" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="">
                        <FormLabel>Choose Room Amenities</FormLabel>
                        <FormDescription>What makes this room a good choice?</FormDescription>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <FormField
                                control={form.control}
                                name="roomService"
                                render={({ field }) => (
                                    <FormItem className=" flex flex-row space-x-3 rounded-md items-end border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel>24hrs Room Services</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="TV"
                                render={({ field }) => (
                                    <FormItem className=" flex flex-row space-x-3 rounded-md items-end border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel>TV</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="balcony"
                                render={({ field }) => (
                                    <FormItem className=" flex flex-row space-x-3 rounded-md items-end border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel>Balcony</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="freeWifi"
                                render={({ field }) => (
                                    <FormItem className=" flex flex-row space-x-3 rounded-md items-end border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel>Free Wifi</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cityView"
                                render={({ field }) => (
                                    <FormItem className=" flex flex-row space-x-3 rounded-md items-end border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel>City View</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="oceanView"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row space-x-3 rounded-md items-end border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel>Ocean View</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="forestView"
                                render={({ field }) => (
                                    <FormItem className=" flex flex-row space-x-3 rounded-md items-end border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel>Forest View</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mountainView"
                                render={({ field }) => (
                                    <FormItem className=" flex flex-row space-x-3 rounded-md items-end border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel>Mountain View</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="airCondition"
                                render={({ field }) => (
                                    <FormItem className=" flex flex-row space-x-3 rounded-md items-end border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel>Air Condition</FormLabel>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="soundProofed"
                                render={({ field }) => (
                                    <FormItem className=" flex flex-row space-x-3 rounded-md items-end border p-4">
                                        <FormControl>
                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormLabel>Sound Proofed</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem className="flex flex-col space-y-3">
                                <FormLabel>Upload an Image</FormLabel>
                                <FormDescription>Choose an image that will show-case your room nicely</FormDescription>
                                <FormControl>
                                    {image ? (
                                        <>
                                            <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                                                <Image fill src={image} alt="Hotel Image" className="object-contain" />
                                                <Button onClick={() => handleImageDelete(image)} type="button" size="icon" variant="ghost" className=" absolute right-[-12px] top-0">
                                                    {imageIsDeleting ? <Loader2 /> : <XIcon />}
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className=" flex flex-col items-center max-w-[400px] p-12 border-2 border-dashed border-primary/50 rounded mt-4">
                                                <UploadButton
                                                    endpoint="imageUploader"
                                                    onClientUploadComplete={(res) => {
                                                        setImage(res[0].url)
                                                        toast({
                                                            variant: 'success',
                                                            description: 'Upload Completed'
                                                        })
                                                    }}
                                                    onUploadError={(error) => {
                                                        toast({
                                                            variant: 'destructive',
                                                            description: `ERROR! ${error.message}`
                                                        })
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className=" flex flex-row gap-6">
                        <div className="flex flex-1 flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="roomPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Room Price in USD *</FormLabel>
                                        <FormDescription>
                                            State the price for staying in this room for 24hrs
                                        </FormDescription>
                                        <FormControl>
                                            <Input type="number" min={0} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bedCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bed count *</FormLabel>
                                        <FormDescription>
                                            How many beds are available in this room?
                                        </FormDescription>
                                        <FormControl>
                                            <Input type="number" min={0} max={8} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="guestCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Guest count *</FormLabel>
                                        <FormDescription>
                                            How many guest are allowed in this room?
                                        </FormDescription>
                                        <FormControl>
                                            <Input type="number" min={0} max={20} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bathroomCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bathroom count *</FormLabel>
                                        <FormDescription>
                                            How many bathroom are in this room?
                                        </FormDescription>
                                        <FormControl>
                                            <Input type="number" min={0} max={8} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-1 flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="breakFastPrice"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Break fast Price in USD *</FormLabel>
                                        <FormDescription>
                                            State the price for break fast in this room for 24hrs
                                        </FormDescription>
                                        <FormControl>
                                            <Input type="number" min={0} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="kingBed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>King Bed</FormLabel>
                                        <FormDescription>
                                            How many king beds are available in this room?
                                        </FormDescription>
                                        <FormControl>
                                            <Input type="number" min={0} max={8} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="queenBed"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Queen beds</FormLabel>
                                        <FormDescription>
                                            How many queen beds are available in this room?
                                        </FormDescription>
                                        <FormControl>
                                            <Input type="number" min={0} max={20} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="pt-4 pb-2">
                        {room ? <Button onClick={form.handleSubmit(onSubmit)} type="button" className="max-w-[150px]" disabled={isLoading}>{isLoading ? <> <Loader2 className="mr-2 h-4 w-4" /> Updating </> : <> <PencilLine className=" mr-2 h-4 w-4" /> Update </>} </Button> :
                            <Button onClick={form.handleSubmit(onSubmit)} type="button"  className="max-w-[150px]" disabled={isLoading}>
                                {isLoading ? <> <Loader2 className=" mr-2 h-4 w-4" /> Creating </> : <> <PencilLine className=" mr-2 h-4 w-4" /> Create Room</>}
                            </Button>}
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AddRoomForm