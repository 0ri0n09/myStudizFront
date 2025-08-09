<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useToast } from "~/components/ui/toast";

const defaultValue = 'item-1'
const accordionItems = [
  { value: 'item-1', title: 'Is it accessible?', content: 'Yes. It adheres to the WAI-ARIA design pattern.' },
  { value: 'item-2', title: 'Is it unstyled?', content: 'Yes. It\'s unstyled by default, giving you freedom over the look and feel.' },
  { value: 'item-3', title: 'Can it be animated?', content: 'Yes! You can use the transition prop to configure the animation.' },
]

const steps = [
  {
    step: 1,
    title: 'Your details',
    description: 'Provide your name and email',
  },
  {
    step: 2,
    title: 'Company details',
    description: 'A few details about your company',
  },
  {
    step: 3,
    title: 'Invite your team',
    description: 'Start collaborating with your team',
  },
]

const { toast } = useToast()
</script>

<template>
  <div>
    <Button class="my-5 mx-52" @click="navigateTo('/')">
      Back to dashboard
    </Button>
    <div class="container mx-auto">
      <Button
          variant="outlineDestructive"
          @click="() => {
              toast({
              title: 'Scheduled: Catch up',
              description: 'Friday, February 10, 2023 at 5:57 PM',
              variant: 'destructive',
            });
          }">
        Test toast
      </Button>
      <div class="flex items-center justify-center">
        <div class="border rounded p-4 m-4">
        <div class="font-bold">INPUT</div>
        <Input placeholder="test" />
      </div>
      </div>

      <div class="flex items-center justify-center">
        <div class="border rounded p-4 m-4">
        <p class="font-bold">ACCORDION</p>
        <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
          <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
            <AccordionTrigger>{{ item.title }}</AccordionTrigger>
            <AccordionContent>
              {{ item.content }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      </div>

      <div class="flex items-center justify-center">
        <div class="border rounded p-4 m-4">
        <div class="font-bold">AVATAR</div>
        <Avatar>
          <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="@radix-vue" />
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
      </div>
      </div>

      <div class="flex items-center justify-center">
        <div class="border rounded p-4 m-4">
        <div class="font-bold">BADGE</div>
        <Badge variant="default">Badge</Badge>
      </div>
      </div>

      <div class="flex items-center justify-center">
        <div class="border rounded p-4 m-4">
        <div class="font-bold">DIALOG</div>
        <Dialog>
          <DialogTrigger as-child>
            <Button variant="outline">
              Share
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to view this.
              </DialogDescription>
            </DialogHeader>
            <div class="flex items-center space-x-2">
              <div class="grid flex-1 gap-2">
                <Label for="link" class="sr-only">
                  Link
                </Label>
                <Input id="link" modelValue="https://shadcn-vue.com/docs/installation" />
              </div>
              <Button type="submit" size="sm" class="px-3 border-primary hover:bg-primary group" variant="outline">
                <span class="sr-only">Copy</span>
                <Icon icon="mingcute:copy-fill" class="w-4 h-4 text-primary group-hover:text-primary-foreground" :ssr="true"/>
              </Button>
            </div>
            <DialogFooter class="sm:justify-start">
              <DialogClose as-child>
                <Button type="button" variant="outlineDestructive">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      </div>

      <div class="flex items-center justify-center">
        <div class="border rounded p-4 m-4">
        <div class="font-bold">STEPPER</div>
        <Stepper class="flex w-full items-start gap-2">
          <StepperItem
              v-for="step in steps"
              :key="step.step"
              v-slot="{ state }"
              class="relative flex w-full flex-col items-center justify-center"
              :step="step.step"
          >
            <StepperSeparator
                v-if="step.step !== steps[steps.length - 1].step"
                class="absolute left-[calc(50%+20px)] right-[calc(-50%+10px)] top-5 block h-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
            />

            <StepperTrigger as-child>
              <Button
                  :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                  size="icon"
                  class="z-10 rounded-full shrink-0"
                  :class="[state === 'active' && 'ring-2 ring-primary ring-offset-2 ring-offset-background']"
              >
                <Icon icon="mingcute:copy-fill" v-if="state === 'completed'" class="size-5"/>
                <Icon icon="mingcute:copy-fill" v-if="state === 'active'" class="size-4" />
                <Icon icon="mingcute:copy-fill" v-if="state === 'inactive'" class="size-4 text-primary" />
              </Button>
            </StepperTrigger>

            <div class="mt-5 flex flex-col items-center text-center">
              <StepperTitle
                  :class="[state === 'active' && 'text-primary']"
                  class="text-sm font-semibold transition lg:text-base"
              >
                {{ step.title }}
              </StepperTitle>
              <StepperDescription
                  :class="[state === 'active' && 'text-primary']"
                  class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
              >
                {{ step.description }}
              </StepperDescription>
            </div>
          </StepperItem>
        </Stepper>
      </div>
      </div>

      <div class="flex items-center justify-center">
        <div class="w-1/4 border rounded p-4 m-4">
          <Calendar v-model="value" :weekday-format="'short'" class="rounded-md border" />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>
