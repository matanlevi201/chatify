import { setProfile } from "@/api";
import { SetProfileSchema } from "@/components/form-update-profile";
import { setUserProfile } from "@/lib/query-current-user-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useCurrentUserMutation() {
  const queryClient = useQueryClient();
  const updateProfileMutation = useMutation({
    mutationKey: ["set_profile"],
    mutationFn: async (data: SetProfileSchema) => {
      return await setProfile({ ...data, fullname: data.fullname });
    },
    onSuccess(data: SetProfileSchema) {
      setUserProfile(queryClient, data);
    },
  });

  return { updateProfileMutation };
}

export default useCurrentUserMutation;
