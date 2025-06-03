import { setProfile } from "@/api";
import { setUserProfile } from "@/lib/query-current-user-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useCurrentUserMutation() {
  const queryClient = useQueryClient();
  const updateProfileMutation = useMutation({
    mutationKey: ["set_profile"],
    mutationFn: async (data: {
      fullname: string;
      bio?: string;
      avatar?: Blob;
    }) => {
      return await setProfile({ ...data });
    },
    onSuccess(data: { fullname: string; bio?: string; avatar?: string }) {
      setUserProfile(queryClient, data);
    },
  });

  return { updateProfileMutation };
}

export default useCurrentUserMutation;
